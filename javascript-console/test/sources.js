describe('sources', function() {
  let tool = eruda.get('sources')
  let $tool = $('.eruda-sources')

  beforeEach(function() {
    eruda.show('sources')
  })

  describe('js', function() {
    it('highlight', function() {
      tool.set('js', '/* test */')
      expect($tool.find('.eruda-content')).toContainHtml(
        '<span style="color:#63a35c;">/* test */</span>'
      )
    })
  })
})
