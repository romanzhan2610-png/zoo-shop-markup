export function initMasks() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]:not(.code-input)');

  phoneInputs.forEach(input => {
    if (window.IMask) {
      const mask = IMask(input, {
        mask: '+{7} (000) 000-00-00',
        prepare: function (appended, masked) {
          if ((appended === '8' || appended === '7') && masked.unmaskedValue === '') {
            setTimeout(() => {
              if (mask.value === '') {
                mask.value = '+7 ';
                mask.updateValue();
              }
            }, 0);
            return '';
          }
          return appended;
        }
      });
    }
  });
}