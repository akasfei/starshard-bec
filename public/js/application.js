$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}; // convert form to json

var parseForm = function() {
  var data = $('#apply-form').serializeObject();
  for (id in data) {
    if (data[id].length < 1) {
      $('#' + id).parents('.form-group').addClass('has-error');
      $('#error-text').text('有地方没填喔～');
      $('#apply-form .alert-danger').removeClass('hidden');
      return null;
    }
    $('#' + id).parents('.form-group').removeClass('has-error');
  }
  return data;
}

$(document).ready(function (e){
  $('.to-content').click(function (e) {
    $('html, body').animate({
      'scrollTop': 260
    }, 1000);
    $('.nav.nav-pills li').removeClass('active');
    $('.nav.nav-pills a[href="'+ $(this).attr('href') +'"]').parent().addClass('active');
  });

  $('#form-submit').click(function (e) {
    var $this = $(this);
    var data = parseForm();
    if (data) {
      $this.button('loading');
      $.ajax({
        url: '/bec/apply',
        data: data,
        type: 'POST',
        success: function (data, status) {
          $this.button('reset');
          $('.has-error').removeClass('has-error')
          $('#apply-form .alert-success').removeClass('hidden');
          $('#apply-form .alert-danger').addClass('hidden');
          $('input').val('');
          setTimeout(function() {
            $('#apply-form .alert-success').addClass('hidden');
          }, 15000);
          $('html, body').animate({
            'scrollTop': 260
          }, 1000);
        },
        error: function (jqxhr, status, err) {
          $this.button('reset');
          $('#error-text').text(err);
          $('#apply-form .alert-danger').removeClass('hidden');
          $('html, body').animate({
            'scrollTop': 260
          }, 1000);
        }
      });
    }
  });
});
