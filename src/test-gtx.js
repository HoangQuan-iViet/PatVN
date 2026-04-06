async function run() {
    let text = "<p>";
    for(let i = 0; i < 500; i++) {
        text += "Nội dung bài viết mẫu số " + i + " rất là dài và phức tạp. ";
    }
    text += "</p>";
    
    console.log("String length:", text.length);
    console.log("Encoded length:", encodeURIComponent(text).length);

    try {
        const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        const fetchRes = await fetch(gtxUrl);
        console.log("Status:", fetchRes.status);
        if (!fetchRes.ok) throw new Error(fetchRes.statusText);
        const parsedData = await fetchRes.json();
        console.log("Translated length:", parsedData[0].map(chunk => chunk[0]).join('').length);
    } catch(e) {
        console.error("Error:", e.message);
    }
}
run();
