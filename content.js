let currentSelectedText = "";
document.addEventListener('mouseup', (event) => {
    setTimeout(() => {
        const selectedText = window.getSelection().toString().trim();
        if (!selectedText || selectedText.length < 3) return;
        currentSelectedText = selectedText;

        const oldIframe = document.getElementById('my-toolbox-iframe');
        if (oldIframe) oldIframe.remove();

        const iframe = document.createElement('iframe');
        iframe.id = 'my-toolbox-iframe';
        iframe.style.cssText = `position: fixed; top: ${event.clientY + 15}px; left: ${event.clientX + 15}px; width: 220px; height: 50px; border: none; z-index: 2147483647; background: transparent;`;
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.body.innerHTML = `<style>body{margin:0;display:flex;gap:5px;background:#fff;padding:5px;border:1px solid #007bff;border-radius:8px;align-items:center;} button{cursor:pointer;padding:5px;font-size:12px;}</style>
        <button id="listen">🔊</button><button id="save">💾 حفظ</button>`;

        doc.getElementById('listen').onclick = () => {
            const utterance = new SpeechSynthesisUtterance(currentSelectedText);
            window.parent.speechSynthesis.speak(utterance);
        };

        doc.getElementById('save').onclick = async () => {
            let translation = "---";
            try {
                const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(currentSelectedText)}&langpair=en|ar`);
                const data = await res.json();
                if (data.responseData) translation = data.responseData.translatedText;
            } catch (e) { console.error(e); }

            chrome.storage.local.get({savedWords: []}, (res) => {
                res.savedWords.push({word: currentSelectedText, translation: translation});
                chrome.storage.local.set({savedWords: res.savedWords}, () => {
                    doc.getElementById('save').innerText = '✅ تم';
                });
            });
        };
    }, 100);
});

document.addEventListener('mousedown', (e) => {
    const iframe = document.getElementById('my-toolbox-iframe');
    if (iframe && e.target !== iframe) iframe.remove();
});