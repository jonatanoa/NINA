/* ================================================
   CONTACT FORM — EmailJS Integration
   Centro Educativo NINA
   ================================================ */

const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    submitBtn.disabled    = true;
    submitBtn.textContent = '⏳ Enviando...';

    const templateParams = {
        name:    document.getElementById('name').value,
        email:   document.getElementById('email').value,
        phone:   document.getElementById('phone').value || 'No proporcionado',
        message: document.getElementById('message').value,
        time:    new Date().toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' })
    };

    emailjs.send('service_j289d5s', 'template_afwmo49', templateParams)
        .then(function () {
            submitBtn.textContent    = '✅ ¡Mensaje Enviado!';
            submitBtn.style.background = '#9EF01A';
            formStatus.textContent   = '🎉 ¡Mensaje mágico enviado! Te contactaremos pronto.';
            formStatus.className     = 'form-status success';

            setTimeout(() => {
                form.reset();
                submitBtn.disabled       = false;
                submitBtn.textContent    = '🌟 ¡Enviar Mensaje Mágico!';
                submitBtn.style.background = '';
                formStatus.className     = 'form-status';
            }, 4000);
        }, function () {
            submitBtn.disabled    = false;
            submitBtn.textContent = '🌟 ¡Enviar Mensaje Mágico!';
            formStatus.textContent = '⚠️ Ups, algo salió mal. Intenta de nuevo o escríbenos por WhatsApp.';
            formStatus.className  = 'form-status error';
            setTimeout(() => { formStatus.className = 'form-status'; }, 5000);
        });
});
