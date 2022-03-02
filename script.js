document.addEventListener('DOMContentLoaded', function(){
    const STORE_NUMS = 'calc-train__nums';
    const STORE_SETS = 'calc-train__sets';

    let locale = 'en';
    if(window.navigator && window.navigator.languages && window.navigator.languages[0] && window.navigator.languages[0].indexOf('ru') === 0) {
        locale = 'ru';
    }
    document.querySelector('html').setAttribute('lang', locale);

    const ints = [2, 3, 4, 5, 6, 7, 8, 9];
    let multiplier = [
        { n: 2, enabled: true },
        { n: 3, enabled: true },
        { n: 4, enabled: true },
        { n: 5, enabled: true },
        { n: 6, enabled: true },
        { n: 7, enabled: true },
        { n: 8, enabled: true },
        { n: 9, enabled: true },
    ];
    let optionSets = true;
    let n1 = 0;
    let n2 = 0;
    let prev1 = 0;
    let prev2 = 0;
    let statValid = 0;
    let statInvalid = 0;

    const view = document.querySelector('.view__text');
    const input = document.querySelector('.view__input');
    const $statValid = document.querySelector('.stats__valid-val');
    const $statInvalid = document.querySelector('.stats__invalid-val');
    const options = document.querySelector('.options');
    const optionsOverlay = document.querySelector('.options-overlay');
    const optionsToggle = document.querySelector('.options__toggle-input');

    function addValid() {
        statValid++;
        $statValid.innerHTML = statValid;
    }
    function addInvalid() {
        statInvalid++;
        $statInvalid.innerHTML = statInvalid;
    }
    function clearStats() {
        statValid = 0;
        statInvalid = 0;
        $statValid.innerHTML = 0;
        $statInvalid.innerHTML = 0;
    }

    function restore() {
        let local = localStorage.getItem(STORE_NUMS);
        if(local){
            local = local.split(',').map(function(el){ return Number(el) });
            multiplier.forEach(function(el){
                el.enabled = local.includes(el.n);
            });
        }
        multiplier.forEach(function(el){
            document.querySelector('.options-n input[value="'+el.n+'"]').checked = el.enabled;
        });
        optionSets = localStorage.getItem(STORE_SETS) === 'false' ? false : true;
        optionsToggle.checked = !!optionSets;
    }
    function store() {
        const enabled = multiplier.filter(function(el){ return el.enabled });
        if(enabled.length === 8) {
            localStorage.removeItem(STORE_NUMS);
        } else {
            localStorage.setItem(STORE_NUMS, enabled.map(function(el){ return el.n }).join(','));
        }

        if(optionSets === true) {
            localStorage.removeItem(STORE_SETS);
        } else {
            localStorage.setItem(STORE_SETS, 'false');
        }
    }
    restore();

    function generate() {
        clear();
        const enabled = multiplier.filter(function(el){ return el.enabled });
        n1 = enabled[Math.floor(Math.random()*enabled.length)].n;
        n2 = optionSets ?
                ints[Math.floor(Math.random()*ints.length)]
                :
                n2 = enabled[Math.floor(Math.random()*enabled.length)].n;
        if((n1 === prev1 && n2 === prev2) || (n1 === prev2 && n2 === prev1)){
            generate();
        } else {
            prev1 = n1;
            prev2 = n2;
            view.innerHTML = n1+'x'+n2;
        }
    }
    generate();

    function check() {
        const result = Number(input.value);
        input.disabled = true;
        if(n1*n2 === result){
            input.classList.add('view__input--success');
            addValid();
            setTimeout(() => {
                generate();
            },1000);
        } else {
            input.classList.add('view__input--error');
            addInvalid();
        }
        setTimeout(() => {
            clear();
        }, 1000);
    }
    function clear() {
        input.disabled = false;
        input.value = '';
        input.focus();
        input.classList.remove('view__input--success', 'view__input--error');
    }


    input.focus();
    input.addEventListener('keydown', function(e){
        if(e.key === 'Escape'){
            input.value = '';
        }
        if(e.key === 'Enter'){
            check();
        }
    });
    
    
    if(optionsToggle){
        function setOptionsToggle() {
            options.classList.remove('options-selected--sets', 'options-selected--numbers');
            if(optionsToggle.checked){
                options.classList.add('options-selected--sets');
            } else {
                options.classList.add('options-selected--numbers');
            }
        }
        optionsToggle.addEventListener('change', function(){
            optionSets = optionsToggle.checked;
            setOptionsToggle();
            store();
            generate();
        });
        setOptionsToggle();

        document.querySelector('.js-toggle-sets').addEventListener('click', function() {
            optionsToggle.checked = true;
            setOptionsToggle();
        });
        document.querySelector('.js-toggle-numbers').addEventListener('click', function() {
            optionsToggle.checked = false;
            setOptionsToggle();
        });
    }


    document.querySelector('.btn-calcel-stats').addEventListener('click', function(){
        clearStats();
        input.focus();
    });
    document.querySelector('.btn-close').addEventListener('click', function(){
        options.classList.remove('options--open');
        optionsOverlay.classList.remove('options--open');
        input.focus();
    });
    document.querySelector('.btn-options').addEventListener('click', function(){
        options.classList.toggle('options--open');
        optionsOverlay.classList.toggle('options--open');
        input.focus();
    });
    [].forEach.call(document.querySelectorAll('.options-n input'), function(chk){
        chk.addEventListener('change', function(e){
            multiplier.forEach(function(el){
                if(el.n == e.target.value){
                    el.enabled = e.target.checked;
                }
            });
            store();
            generate();
        });
    });
});
