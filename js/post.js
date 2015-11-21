(function() {
  var opts = {
    token:  '{{ site.token }}',
    owner:  '{{ site.owner  }}',
    repo:   '{{ site.repo   }}',
    branch: '{{ site.branch }}',
    forkBranch: localStorage.getItem('forkBranch')
  }

  if(!opts.forkBranch) {
    opts.forkBranch = (Math.random().toString(36) + '00000000000000000').slice(2, 9);
    localStorage.setItem('forkBranch', opts.forkBranch);
  }

  var showSection    = document.getElementById('show-section');
  var errorSection   = document.getElementById('error-section');
  var successSection = document.getElementById('success-section');
  var editSection    = document.getElementById('edit-section');
  var pullLink       = document.getElementById('pull-link');
  var textElem       = document.getElementsByName('text')[0];
  var messageElem    = document.getElementsByName('message')[0];
  var sections = [showSection, errorSection, editSection, successSection];

  function show(elem) { elem.className = elem.className.replace('hide', ''); }
  function hideAll() { sections.forEach(hide); }
  function hide(elem) {
    show(elem);
    elem.className += ' hide';
  }

  function displayError(err) {
    var message = !err.request ? err.message :
      err.request.statusText + ': ' + JSON.parse(err.request.response).message;

    errorSection.innerHTML = message;
    show(errorSection);
  }

  window.load = function(path) {
    opts.path = path;

    wikihub.load(opts)
      .then(function(text) {
        textElem.value = text;
        hideAll();
        show(editSection);
      })
      .catch(displayError);
  };

  window.cancel = function() {
    hideAll();
    show(showSection);
  };

  window.save = function() {
    opts.text = textElem.value;
    opts.message = messageElem.value;
    if(opts.message) { opts.title = opts.message; }

    wikihub.save(opts)
      .then(function(pull) {
        hideAll();
        pullLink.setAttribute('href', pull.html_url);
        show(successSection);
        show(showSection);
      })
      .catch(displayError);
  };
})();
