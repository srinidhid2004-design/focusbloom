import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import App from './App.vue'

const preferences = {
  motion_mode: 'standard',
  guidance_level: 'standard',
  difficulty: 'standard',
  remember_preferences: false,
  version: 1,
  updated_at: '2026-10-28T12:00:00.000Z',
}

function json(body, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  }))
}

function installApi({
  noMotion = false,
  modelFailure = false,
  populated = false,
  perspectiveResult = null,
  perspectiveDeferred = null,
} = {}) {
  const session = {
    session_id: 'session-1',
    activity_type: 'different_leaf',
    status: 'active',
    started_at: '2026-10-28T12:00:00.000Z',
    ended_at: null,
    duration_ms: 0,
    difficulty: 'standard',
    motion_mode: noMotion ? 'no_motion' : 'standard',
    guidance_level: 'standard',
    perspective_progress: 'none',
    alternative_save_state: 'none',
    seed_save_state: 'none',
    model_status: 'skipped',
    version: 1,
    created_at: '2026-10-28T12:00:00.000Z',
    updated_at: '2026-10-28T12:00:00.000Z',
  }
  globalThis.fetch = vi.fn(async (url, options = {}) => {
    const path = String(url)
    const method = options.method ?? 'GET'
    const body = options.body ? JSON.parse(options.body) : null
    if (path.endsWith('/preferences') && method === 'GET') return json({ outcome: 'success', preferences: { ...preferences, motion_mode: noMotion ? 'no_motion' : 'standard' } })
    if (path.endsWith('/preferences') && method === 'PUT') return json({ outcome: 'success', preferences: { ...preferences, ...body, version: 2 } })
    if (path.endsWith('/focus-activities')) return json({
      outcome: 'success',
      activities: [
        'different_leaf', 'ripple_path', 'flower_match', 'flower_change',
        'petal_sequence', 'clue_search', 'garden_path',
      ].map((activity_type) => ({ activity_type, label: activity_type, instruction: 'Choose one visible option.' })),
      controls: ['Show me', 'Skip this', 'Stop', 'Support'],
      notice: 'No score.',
    })
    if (path.endsWith('/activity-sessions') && method === 'POST') return json({ outcome: 'success', session: { ...session, activity_type: body.activity_type } }, 201)
    if (path.includes('/events')) return json({ outcome: 'success', event: { event_id: 'event-1' } }, 201)
    if (path.includes('/activity-sessions/') && method === 'PATCH') return json({ outcome: 'success', session: { ...session, status: body.action === 'complete' ? 'completed' : body.action === 'interrupt' ? 'interrupted' : body.action === 'skip' ? 'skipped' : 'stopped', duration_ms: body.duration_ms, version: 2 } })
    if (path.includes('/activity-sessions?')) return json({ outcome: 'success', sessions: populated ? [{ ...session, status: 'completed', duration_ms: 48000 }] : [], next_cursor: null })
    if (path.includes('/perspective-artifacts?')) return json({ outcome: 'success', artifacts: [], next_cursor: null })
    if (path.includes('/next-step-seeds?')) return json({ outcome: 'success', seeds: [], next_cursor: null })
    if (path.endsWith('/perspective/alternatives')) {
      if (perspectiveDeferred) return perspectiveDeferred({ body, options })
      if (modelFailure) {
        const failure = modelFailure === true
          ? { outcome: 'missing_configuration', message: 'Gemini is not configured.', status: 503 }
          : modelFailure
        return json({ outcome: failure.outcome, message: failure.message }, failure.status)
      }
      const output = perspectiveResult?.(body.scenario) ?? {
        alternatives: [{
          alternative: 'The fictional timing may be unrelated.',
          reasoning: 'The submitted scenario describes timing without establishing one cause.',
          missing_context: 'The submitted scenario does not include the reason for the event.',
        }],
        reflection_question: 'What other factual context would help compare the possibilities?',
        limitation: 'Coursework prototype; not therapy or medical advice.',
      }
      return json({ outcome: 'success', request: { attempt_count: 1 }, alternatives: output, saved: false })
    }
    if (path.endsWith('/perspective-artifacts') && method === 'POST') return json({ outcome: 'success', artifact: { artifact_id: 'artifact-1', ...body } }, 201)
    if (path.endsWith('/next-step-seeds') && method === 'POST') return json({ outcome: 'success', seed: { seed_id: 'seed-1', ...body } }, 201)
    if (path.endsWith('/conversations')) return json({ outcome: 'success', conversation: { conversation_id: 'conversation-1' } }, 201)
    if (path.includes('/messages')) return json({ outcome: 'success', message: {}, request: { request_id: 'request-1' } }, 201)
    if (path.endsWith('/garden-guide/history-questions')) return json({ outcome: 'history_no_match', request: { attempt_count: 1 }, answer: null, row_references: [] })
    return json({ outcome: 'success' })
  })
}

describe('FocusBloom Vue experience', () => {
  beforeEach(() => {
    sessionStorage.clear()
    installApi()
  })
  afterEach(() => vi.restoreAllMocks())

  it('presents the low-input entry and independent Support with focus restoration', async () => {
    const wrapper = mount(App, { attachTo: document.body })
    await flushPromises()
    expect(wrapper.get('[data-state="entry"] h1').text()).toBe('Choose one small step')
    expect(wrapper.text()).toContain('not therapy, diagnosis, or monitoring')

    const supportButton = wrapper.get('.support-button')
    supportButton.element.focus()
    await supportButton.trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="support-open"]').text()).toContain('Support information — United States demo')
    expect(wrapper.text()).toContain('Call 988')
    await wrapper.get('[data-state="support-open"] .primary').trigger('click')
    await flushPromises()
    expect(document.activeElement).toBe(supportButton.element)
    wrapper.unmount()
  })

  it('keeps the activity active, moves the correct option each round, and ends only on Stop', async () => {
    const wrapper = mount(App)
    await flushPromises()
    await wrapper.get('.entry-view .primary').trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="focus-active"] h1').text()).toContain('differently shaped leaf')

    let options = wrapper.findAll('.activity-option')
    expect(options.findIndex((option) => option.text().includes('Pointed leaf'))).toBe(1)
    await options[0].trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Try again')
    await options[1].trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="focus-active"]').text()).toContain('A new round is ready')
    options = wrapper.findAll('.activity-option')
    expect(options.findIndex((option) => option.text().includes('Pointed leaf'))).toBe(2)
    await options[2].trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="focus-active"]').exists()).toBe(true)
    options = wrapper.findAll('.activity-option')
    expect(options.findIndex((option) => option.text().includes('Pointed leaf'))).toBe(0)
    expect(globalThis.fetch.mock.calls.filter(([, request]) => request?.method === 'PATCH')).toHaveLength(0)
    await wrapper.findAll('.controls-row .secondary')[0].trigger('click')
    await flushPromises()
    expect(wrapper.get('.hint').text()).toBe('The pointed leaf has a diamond shape.')
    expect(wrapper.get('.hint').text()).not.toMatch(/center|middle/i)
    await wrapper.get('.button.stop').trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="focus-stopped"]').text()).toContain('stopped')
    const patches = globalThis.fetch.mock.calls.filter(([, request]) => request?.method === 'PATCH')
    expect(patches).toHaveLength(1)
    expect(JSON.parse(patches[0][1].body).action).toBe('stop')
    const eventTypes = globalThis.fetch.mock.calls
      .filter(([url, request]) => String(url).includes('/events') && request?.method === 'POST')
      .map(([, request]) => JSON.parse(request.body).event_type)
    expect(eventTypes).not.toContain('completed')
  })

  it('lets Skip end an active Focus Garden without a score or automatic completion', async () => {
    const wrapper = mount(App)
    await flushPromises()
    await wrapper.get('.entry-view .primary').trigger('click')
    await flushPromises()
    await wrapper.findAll('.controls-row .secondary')[1].trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="focus-stopped"]').text()).toContain('skipped without a score or penalty')
    const patches = globalThis.fetch.mock.calls.filter(([, request]) => request?.method === 'PATCH')
    expect(JSON.parse(patches[0][1].body).action).toBe('skip')
    const eventTypes = globalThis.fetch.mock.calls
      .filter(([url, request]) => String(url).includes('/events') && request?.method === 'POST')
      .map(([, request]) => JSON.parse(request.body).event_type)
    expect(eventTypes).toContain('skipped')
    expect(eventTypes).not.toContain('completed')
  })

  it('makes every approved no-typing activity reachable while retaining the default start', async () => {
    const allActivities = [
      'different_leaf', 'ripple_path', 'flower_match', 'flower_change',
      'petal_sequence', 'clue_search', 'garden_path',
    ]
    const wrapper = mount(App)
    await flushPromises()
    const select = wrapper.get('#activity-choice')
    expect(select.findAll('option').map((option) => option.element.value)).toEqual(allActivities)
    await select.setValue('ripple_path')
    await wrapper.get('.entry-view .primary').trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="focus-active"] h1').text()).toBe('Follow the ripple path')
    const createCall = globalThis.fetch.mock.calls.find(([url, request]) => String(url).endsWith('/activity-sessions') && request?.method === 'POST')
    expect(JSON.parse(createCall[1].body).activity_type).toBe('ripple_path')
  })

  it('renders no-motion with identical controls and interrupts before opening Support', async () => {
    installApi({ noMotion: true })
    const wrapper = mount(App, { attachTo: document.body })
    await flushPromises()
    await wrapper.get('.entry-view .primary').trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="focus-active"]').classes()).toContain('no-motion')
    expect(wrapper.text()).toContain('Nothing scales, ripples, fades, or translates')
    const supportButton = wrapper.get('.support-button')
    supportButton.element.focus()
    await supportButton.trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="support-open"]').exists()).toBe(true)
    expect(wrapper.get('[data-state="focus-stopped"]').text()).toContain('interrupted')
    await wrapper.get('[data-state="support-open"] .primary').trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="focus-stopped"]').text()).toContain('did not resume or complete automatically')
    expect(document.activeElement).toBe(supportButton.element)
    wrapper.unmount()
  })

  it('keeps the reviewed fictional demonstration distinct and makes no Gemini request', async () => {
    const wrapper = mount(App)
    await flushPromises()
    await wrapper.findAll('.entry-view .secondary')[0].trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="perspective-entry"]').text()).toContain('Reviewed fictional demonstration')
    await wrapper.get('[data-state="perspective-entry"] .primary').trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="perspective-evidence"]').text()).toContain('reviewed Alex demonstration')
    await wrapper.get('[data-state="perspective-evidence"] .primary').trigger('click')
    expect(wrapper.get('[data-state="perspective-alt-ready"]').text()).toContain('Reviewed fictional example')
    expect(globalThis.fetch.mock.calls.filter(([url]) => String(url).endsWith('/perspective/alternatives'))).toHaveLength(0)
  })

  it('submits only the normalized custom scenario and displays the complete bounded draft', async () => {
    installApi({
      perspectiveResult: () => ({
        alternatives: [{
          alternative: 'The room may have been reserved for another activity.',
          reasoning: 'The fictional note states that the room became unavailable.',
          missing_context: 'The note does not state who changed the room or why.',
        }],
        reflection_question: 'What scheduling detail would help compare the possibilities?',
        limitation: 'Coursework prototype; not therapy or medical advice.',
      }),
    })
    const wrapper = mount(App)
    await flushPromises()
    await wrapper.findAll('.entry-view .secondary')[0].trigger('click')
    await flushPromises()
    await wrapper.get('#custom-interpretation').setValue('  The fictional study room changed before a meeting.  ')
    await wrapper.get('.custom-entry .secondary').trigger('click')
    await flushPromises()
    const preview = wrapper.get('[data-state="perspective-evidence"]')
    expect(preview.text()).toContain('The fictional study room changed before a meeting.')
    expect(preview.text()).not.toMatch(/Alex|classmate left|idea was bad/i)
    await preview.get('.primary').trigger('click')
    await flushPromises()

    const requestCall = globalThis.fetch.mock.calls.find(([url]) => String(url).endsWith('/perspective/alternatives'))
    const requestBody = JSON.parse(requestCall[1].body)
    expect(requestBody.scenario).toBe('The fictional study room changed before a meeting.')
    expect(Object.keys(requestBody).sort()).toEqual(['idempotency_key', 'scenario'])
    expect(JSON.stringify(requestBody)).not.toMatch(/Alex|classmate|idea was bad/i)

    const result = wrapper.get('[data-state="perspective-alt-ready"]')
    expect(result.text()).toContain('The room may have been reserved for another activity.')
    expect(result.text()).toContain('The fictional note states that the room became unavailable.')
    expect(result.text()).toContain('The note does not state who changed the room or why.')
    expect(result.text()).toContain('What scheduling detail would help compare the possibilities?')
    expect(result.text()).toContain('Coursework prototype; not therapy or medical advice.')
    expect(result.text()).toContain('Gemini-generated draft')
    expect(globalThis.fetch.mock.calls.filter(([url, request]) => String(url).endsWith('/perspective-artifacts') && request?.method === 'POST')).toHaveLength(0)
  })

  it('displays different mocked drafts for two different custom scenarios', async () => {
    const resultFor = (scenario) => ({
      alternatives: [{
        alternative: scenario.includes('window') ? 'The window may have been opened for ventilation.' : 'The lamp may have been moved for another task.',
        reasoning: scenario.includes('window') ? 'The scenario mentions an open window.' : 'The scenario mentions a moved lamp.',
        missing_context: 'The reason for the visible change is not stated.',
      }],
      reflection_question: 'What additional fact would distinguish these possibilities?',
      limitation: 'Coursework prototype; not therapy or medical advice.',
    })

    async function runScenario(scenario) {
      installApi({ perspectiveResult: resultFor })
      const wrapper = mount(App)
      await flushPromises()
      await wrapper.findAll('.entry-view .secondary')[0].trigger('click')
      await flushPromises()
      await wrapper.get('#custom-interpretation').setValue(scenario)
      await wrapper.get('.custom-entry .secondary').trigger('click')
      await flushPromises()
      await wrapper.get('[data-state="perspective-evidence"] .primary').trigger('click')
      await flushPromises()
      const text = wrapper.get('[data-state="perspective-alt-ready"]').text()
      wrapper.unmount()
      return text
    }

    const windowResult = await runScenario('A fictional window was open after the break.')
    const lampResult = await runScenario('A fictional lamp was moved before the workshop.')
    expect(windowResult).toContain('opened for ventilation')
    expect(windowResult).not.toContain('moved for another task')
    expect(lampResult).toContain('moved for another task')
    expect(lampResult).not.toContain('opened for ventilation')
  })

  it('preserves custom Perspective work through failure and labels neutral fallback accurately', async () => {
    installApi({ modelFailure: true })
    const wrapper = mount(App)
    await flushPromises()
    await wrapper.findAll('.entry-view .secondary')[0].trigger('click')
    await flushPromises()
    await wrapper.get('#custom-interpretation').setValue('A fictional project note was moved to another folder.')
    await wrapper.get('.custom-entry .secondary').trigger('click')
    await flushPromises()
    await wrapper.get('[data-state="perspective-evidence"] .primary').trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="perspective-model-failed"]').text()).toContain('not configured')
    expect(wrapper.text()).toContain('Your work is still here')
    expect(wrapper.text()).toContain('A fictional project note was moved to another folder.')
    expect(globalThis.fetch.mock.calls.filter(([url]) => String(url).endsWith('/perspective/alternatives'))).toHaveLength(1)
    await wrapper.get('[data-state="perspective-model-failed"] .primary').trigger('click')
    const fallback = wrapper.get('[data-state="perspective-alt-ready"]')
    expect(fallback.text()).toContain('Reviewed fictional example')
    expect(fallback.text()).toContain('not an analysis of the submitted scenario')
    expect(fallback.text()).not.toMatch(/Alex|classmate left|idea was bad/i)
    expect(globalThis.fetch.mock.calls.filter(([url, request]) => String(url).endsWith('/perspective-artifacts') && request?.method === 'POST')).toHaveLength(0)
  })

  it.each([
    ['missing configuration', { outcome: 'missing_configuration', message: 'Gemini is not configured.', status: 503 }],
    ['timeout', { outcome: 'model_failure', message: 'The provider request timed out safely.', status: 504 }],
    ['malformed output', { outcome: 'model_failure', message: 'The provider response was rejected safely.', status: 502 }],
    ['other provider failure', { outcome: 'model_failure', message: 'The provider could not complete the request.', status: 502 }],
  ])('keeps Support independent after %s', async (_label, failure) => {
    installApi({ modelFailure: failure })
    const wrapper = mount(App, { attachTo: document.body })
    await flushPromises()
    await wrapper.findAll('.entry-view .secondary')[0].trigger('click')
    await flushPromises()
    const scenario = 'A fictional schedule changed before a workshop.'
    await wrapper.get('#custom-interpretation').setValue(scenario)
    await wrapper.get('.custom-entry .secondary').trigger('click')
    await flushPromises()
    await wrapper.get('[data-state="perspective-evidence"] .primary').trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="perspective-model-failed"]').text()).toContain(scenario)
    const submissionsBeforeSupport = globalThis.fetch.mock.calls.filter(
      ([url]) => String(url).endsWith('/perspective/alternatives'),
    ).length
    const supportButton = wrapper.get('.support-button')
    supportButton.element.focus()
    await supportButton.trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="support-open"]').exists()).toBe(true)
    await wrapper.get('[data-state="support-open"] .primary').trigger('click')
    await flushPromises()
    expect(document.activeElement).toBe(supportButton.element)
    expect(wrapper.get('[data-state="perspective-model-failed"]').text()).toContain(scenario)
    expect(globalThis.fetch.mock.calls.filter(
      ([url]) => String(url).endsWith('/perspective/alternatives'),
    )).toHaveLength(submissionsBeforeSupport)
    expect(globalThis.fetch.mock.calls.filter(
      ([url, request]) => String(url).endsWith('/perspective-artifacts') && request?.method === 'POST',
    )).toHaveLength(0)
    wrapper.unmount()
  })

  it('ignores a late custom response after cancellation and adds no persistence', async () => {
    let resolveLate
    installApi({
      perspectiveDeferred: () => new Promise((resolve) => {
        resolveLate = () => resolve(new Response(JSON.stringify({
          outcome: 'success',
          request: { attempt_count: 1 },
          alternatives: {
            alternatives: [{
              alternative: 'This late result must not appear.',
              reasoning: 'The delayed mocked response arrived after cancellation.',
              missing_context: 'It is stale.',
            }],
            reflection_question: 'Should this stale result be visible?',
            limitation: 'Coursework prototype; not therapy or medical advice.',
          },
          saved: false,
        }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      }),
    })
    const wrapper = mount(App)
    await flushPromises()
    await wrapper.findAll('.entry-view .secondary')[0].trigger('click')
    await flushPromises()
    await wrapper.get('#custom-interpretation').setValue('A fictional room changed before a meeting.')
    await wrapper.get('.custom-entry .secondary').trigger('click')
    await flushPromises()
    await wrapper.get('[data-state="perspective-evidence"] .primary').trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="perspective-alt-loading"]').exists()).toBe(true)
    await wrapper.get('[data-state="perspective-alt-loading"] .secondary').trigger('click')
    expect(wrapper.get('[data-state="perspective-alt-ready"]').text()).toContain('not an analysis of the submitted scenario')
    resolveLate()
    await flushPromises()
    const finalState = wrapper.get('[data-state="perspective-alt-ready"]')
    expect(finalState.text()).not.toContain('This late result must not appear.')
    expect(finalState.text()).toContain('Reviewed fictional example')
    expect(globalThis.fetch.mock.calls.filter(
      ([url]) => String(url).endsWith('/perspective/alternatives'),
    )).toHaveLength(1)
    expect(globalThis.fetch.mock.calls.filter(
      ([url, request]) => String(url).endsWith('/perspective-artifacts') && request?.method === 'POST',
    )).toHaveLength(0)
  })

  it('saves and deletes only the explicitly selected Perspective artifact', async () => {
    const wrapper = mount(App)
    await flushPromises()
    await wrapper.findAll('.entry-view .secondary')[0].trigger('click')
    await flushPromises()
    await wrapper.get('#custom-interpretation').setValue('A fictional agenda changed before a meeting.')
    await wrapper.get('.custom-entry .secondary').trigger('click')
    await flushPromises()
    await wrapper.get('[data-state="perspective-evidence"] .primary').trigger('click')
    await flushPromises()
    expect(globalThis.fetch.mock.calls.filter(
      ([url, request]) => String(url).endsWith('/perspective-artifacts') && request?.method === 'POST',
    )).toHaveLength(0)
    await wrapper.get('.alternative-card .button').trigger('click')
    const saveButton = wrapper.findAll('[data-state="perspective-alt-ready"] button')
      .find((button) => button.text().includes('Save reviewed alternative'))
    await saveButton.trigger('click')
    await flushPromises()
    expect(globalThis.fetch.mock.calls.filter(
      ([url, request]) => String(url).endsWith('/perspective-artifacts') && request?.method === 'POST',
    )).toHaveLength(1)
    const deleteButton = wrapper.findAll('[data-state="perspective-alt-ready"] button')
      .find((button) => button.text().includes('Delete saved alternative'))
    await deleteButton.trigger('click')
    await flushPromises()
    const deleteCalls = globalThis.fetch.mock.calls.filter(
      ([url, request]) => String(url).includes('/perspective-artifacts/artifact-1') && request?.method === 'DELETE',
    )
    expect(deleteCalls).toHaveLength(1)
    expect(globalThis.fetch.mock.calls.filter(
      ([url, request]) => String(url).includes('/next-step-seeds/') && request?.method === 'DELETE',
    )).toHaveLength(0)
  })

  it('keeps the Next-Step Seed user-authored behind preview and explicit Save', async () => {
    const wrapper = mount(App)
    await flushPromises()
    await wrapper.findAll('.entry-view .secondary')[0].trigger('click')
    await flushPromises()
    await wrapper.get('#custom-interpretation').setValue('A fictional task changed before a workshop.')
    await wrapper.get('.custom-entry .secondary').trigger('click')
    await flushPromises()
    await wrapper.get('[data-state="perspective-evidence"] .primary').trigger('click')
    await flushPromises()
    await wrapper.get('.alternative-card .button').trigger('click')
    const seedButton = wrapper.findAll('[data-state="perspective-alt-ready"] button')
      .find((button) => button.text().includes('Continue to optional Next-Step Seed'))
    await seedButton.trigger('click')
    await flushPromises()

    const inputs = wrapper.findAll('.seed-builder input')
    await inputs[0].setValue('a fictional workshop detail changes')
    await inputs[1].setValue('review the written instructions')
    expect(globalThis.fetch.mock.calls.filter(([url, request]) => String(url).endsWith('/next-step-seeds') && request?.method === 'POST')).toHaveLength(0)
    await wrapper.get('[data-state="next-step-seed"] .secondary.full-width').trigger('click')
    expect(wrapper.get('.preview-card').text()).toContain('If a fictional workshop detail changes, then I will review the written instructions.')
    expect(globalThis.fetch.mock.calls.filter(([url, request]) => String(url).endsWith('/next-step-seeds') && request?.method === 'POST')).toHaveLength(0)
    await wrapper.get('[data-state="next-step-seed"] .primary').trigger('click')
    await flushPromises()
    const saveCall = globalThis.fetch.mock.calls.find(([url, request]) => String(url).endsWith('/next-step-seeds') && request?.method === 'POST')
    const saveBody = JSON.parse(saveCall[1].body)
    expect(saveBody.situation_text).toBe('a fictional workshop detail changes')
    expect(saveBody.action_text).toBe('review the written instructions')
    expect(saveBody.source).toBe('template')
    const deleteSeed = wrapper.findAll('[data-state="next-step-seed"] button')
      .find((button) => button.text().includes('Delete seed'))
    await deleteSeed.trigger('click')
    await flushPromises()
    expect(globalThis.fetch.mock.calls.filter(
      ([url, request]) => String(url).includes('/next-step-seeds/seed-1') && request?.method === 'DELETE',
    )).toHaveLength(1)
    expect(globalThis.fetch.mock.calls.filter(
      ([url, request]) => String(url).includes('/perspective-artifacts/') && request?.method === 'DELETE',
    )).toHaveLength(0)
  })

  it('shows factual populated history and a no-match Garden Guide outcome without an invented answer', async () => {
    installApi({ populated: true })
    const wrapper = mount(App)
    await flushPromises()
    await wrapper.findAll('.entry-view .secondary')[1].trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="history"]').text()).toContain('48 seconds')
    await wrapper.get('.history-view .primary').trigger('click')
    await wrapper.findAll('.question-chip')[0].trigger('click')
    await wrapper.get('.guide-view .primary').trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-state="history-no-match"]').text()).toContain('No matching saved records')
    expect(wrapper.text()).not.toContain('appears in 3')
  })

  it('contains no raw HTML rendering directive', () => {
    expect(App.__file).toBeTruthy()
    expect(document.body.innerHTML).not.toContain('v-html')
  })
})
