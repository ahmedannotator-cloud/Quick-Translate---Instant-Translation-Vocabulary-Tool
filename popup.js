document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('wordList');
    chrome.storage.local.get(['savedWords'], (res) => {
        const words = res.savedWords || [];
        words.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `<div><strong>${item.word}</strong><br><small style="color:gray;">${item.translation}</small></div>
                            <button id="del-${index}" style="padding:2px 5px;">حذف</button>`;
            list.appendChild(div);
            div.querySelector('button').onclick = () => {
                words.splice(index, 1);
                chrome.storage.local.set({savedWords: words}, () => location.reload());
            };
        });
    });

    document.getElementById('exportBtn').onclick = () => {
        chrome.storage.local.get(['savedWords'], (res) => {
            let csv = "\uFEFF النص, الترجمة\n" + (res.savedWords || []).map(i => `"${i.word.replace(/"/g, '""')}","${i.translation.replace(/"/g, '""')}"`).join("\n");
            const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8;'}));
            chrome.downloads.download({url: url, filename: 'my_data.csv', saveAs: true});
        });
    };
});