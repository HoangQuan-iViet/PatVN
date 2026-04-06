async function translate(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  const parsed = await res.json();
  console.log("Original:", text);
  console.log("Translated:", parsed[0].map(x => x[0]).join(''));
}

await translate("Tiêu đề bài viết");
await translate("<p>Đoạn văn <b>In đậm</b></p>");
