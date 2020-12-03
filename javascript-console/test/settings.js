describe('settings', function() {
  let tool = eruda.get('settings')
  let $tool = $('.eruda-settings')

  let cfg = eruda.config.create('eruda-test')
  cfg.set({
    testSwitch: false,
    testSelect: '1',
    testRange: 1,
    testColor: '#fff'
  })

  beforeEach(function() {
    tool.clear()
  })

  it('switch', function() {
    let text = 'Test Switch'

    tool.switch(cfg, 'testSwitch', text)
    expect($tool.find('.eruda-switch')).toContainText(text)
    $tool.find('.eruda-checkbox').click()
    expect(cfg.get('testSwitch')).toBe(true)
  })

  it('separator', function() {
    tool.separator()
    expect($tool.find('.eruda-separator').length).toEqual(1)
  })

  it('select', function() {
    let text = 'Test Select'

    tool.select(cfg, 'testSelect', text, ['1', '2', '3'])
    let $el = $tool.find('.eruda-select')
    expect($el.find('ul li').length).toEqual(3)
    expect($el.find('.eruda-head')).toContainText(text)
    expect($el.find('.eruda-val')).toContainText('1')
    $el.find('.eruda-head').click()
    $el
      .find('ul li')
      .eq(1)
      .click()
    expect(cfg.get('testSelect')).toBe('2')
  })
  it('range', function() {
    let text = 'Test Range'

    tool.range(cfg, 'testRange', text, { min: 0, max: 1, step: 0.1 })
    let $el = $tool.find('.eruda-range')
    expect($el.find('.eruda-head')).toContainText(text)
    expect($el.find('input').length).toEqual(1)
    $el.find('.eruda-head').click()
  })

  it('color', function() {
    let text = 'Test Color'

    tool.color(cfg, 'testColor', text, ['#000', '#fff'])
    let $el = $tool.find('.eruda-color')
    expect($el.find('.eruda-head')).toContainText(text)
    expect($el.find('ul li').length).toEqual(2)
    $el.find('.eruda-head').click()
    $el
      .find('ul li')
      .eq(0)
      .click()
    expect(cfg.get('testColor')).toBe('rgb(0, 0, 0)')
  })

  it('remove', function () {
    let text = 'Test Switch'
    tool.switch(cfg, 'testSwitch', text)
    expect($tool.find('.eruda-switch')).toContainText(text) 
    tool.remove(cfg, 'testSwitch')
    expect($tool.find('.eruda-switch')).toHaveLength(0)
  })
})
