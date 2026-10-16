const slides = [...document.querySelectorAll('.slide')],
    dots = document.querySelector('.dots');
let i = 0, t, pt;

if (slides.length) {
    slides.forEach((_, n) => {
        const b = document.createElement('b');
        b.onclick = () => go(n);
        dots.append(b)
    });

    const go = n => {
        const o = slides.findIndex(s => s.classList.contains('on'));
        i = (n + slides.length) % slides.length;
        slides.forEach((s, k) => {
            s.classList.toggle('prev', k === o && k !== i);
            s.classList.toggle('on', k === i)
        });
        [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
        clearTimeout(pt);
        pt = setTimeout(() => slides.forEach(s => s.classList.remove('prev')), 1100);
        clearInterval(t);
        t = setInterval(() => go(i + 1), 5500)
    };

    document.getElementById('prev').onclick = () => go(i - 1);
    document.getElementById('next').onclick = () => go(i + 1);
    go(0);
}

document.querySelectorAll('.menu').forEach(m => {
    const nl = m.parentElement.querySelector('ul');
    m.onclick = () => {
        const o = nl.classList.toggle('open');
        m.setAttribute('aria-expanded', o)
    };
    nl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        nl.classList.remove('open');
        m.setAttribute('aria-expanded', false)
    }))
});

const f = document.getElementById('form');
f && f.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('msg').textContent = 'Thank you! Your message has been sent.';
    f.reset()
});

const hds = document.querySelectorAll('header');
let on = false;
const sc = () => {
    const y = scrollY;
    if (!on && y > 50) on = true;
    else if (on && y < 12) on = false;
    hds.forEach(h => h.classList.toggle('scrolled', on))
};
sc();
addEventListener('scroll', sc, { passive: true });

/* contact purpose preselect */
const pre = v => {
    const s = document.getElementById('k');
    if (!s || !v) return;
    const o = [...s.options].find(o => o.text === v);
    if (o) s.value = o.value || o.text
};
try {
    const v = sessionStorage.getItem('ve-purpose');
    if (v) {
        pre(v);
        sessionStorage.removeItem('ve-purpose')
    }
} catch (e) {}
document.addEventListener('click', e => {
    const a = e.target.closest('a[data-purpose]');
    if (!a) return;
    const v = a.dataset.purpose;
    pre(v);
    try {
        sessionStorage.setItem('ve-purpose', v)
    } catch (e) {}
});

/* subtle scroll motion (all pages) */
const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
const els = [...document.querySelectorAll('.phero>*,.psec .sec-h,.band .sec-h,.apps>*,.f4>*,.tbl,.note,.bens>*,.tech>*,.sus>*,.faq details,.cta .cg>*,.tiles>*,.prod .pg>*,.frow>.ft,.why .pg>*,.cms>.cm,.qbox>*,.certs.partners>img,.contact>*')];

const count = el => {
    const m = el.textContent.trim().match(/^([\d,]*\d(?:\.\d+)?)(\D*)$/);
    if (!m || el.dataset.done) return;
    el.dataset.done = 1;
    if (rm) return;
    const dec = (m[1].split('.')[1] || '').length,
        n = parseFloat(m[1].replace(/,/g, '')),
        sfx = m[2],
        cm = m[1].includes(','),
        t0 = performance.now(),
        fmt = v => (cm ? v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : v.toFixed(dec)) + sfx;
    el.textContent = fmt(0);
    const step = now => {
        const k = Math.min(1, (now - t0) / 1600),
            v = n * (1 - Math.pow(1 - k, 3));
        el.textContent = fmt(k < 1 ? v : n);
        if (k < 1) requestAnimationFrame(step)
    };
    requestAnimationFrame(step)
};

const reveal = el => {
    el.classList.add('in');
    el.querySelectorAll('.pstat strong,.glass strong,.stats strong').forEach(count);
    setTimeout(() => el.classList.remove('reveal', 'in'), 1500 + (parseFloat(el.style.getPropertyValue('--d')) || 0) * 1000)
};

if (!rm && 'IntersectionObserver' in window) {
    els.forEach(el => {
        const i = [...el.parentElement.children].indexOf(el);
        el.style.setProperty('--d', Math.min(i, 5) * .09 + 's');
        el.classList.add('reveal')
    });
    const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target)
        }
    }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => io.observe(el));
}

const par = [...document.querySelectorAll('.phero>img,.prod .pg>img,.blob')];
if (par.length && !rm) {
    let tk = false;
    const run = () => {
        tk = false;
        par.forEach(el => {
            if (el.offsetParent === null) return;
            if (innerWidth <= 860) {
                el.style.translate = '';
                return
            }
            const r = el.getBoundingClientRect();
            if (r.bottom < -80 || r.top > innerHeight + 80) return;
            el.style.translate = '0 ' + Math.max(-28, Math.min(28, (r.top + r.height / 2 - innerHeight / 2) * -.05)) + 'px'
        })
    };
    addEventListener('scroll', () => {
        if (!tk) {
            tk = true;
            requestAnimationFrame(run)
        }
    }, { passive: true });
    run()
}