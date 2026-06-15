async function test2() {
  const WP_API_BASE = 'https://www.geziyorumturkiye.com/wp-json/wp/v2';
  try {
    const res = await fetch(`${WP_API_BASE}/media/66`);
    const data = await res.json();
    console.log(data.source_url);
  } catch (e) {
    console.log(e.message);
  }
}
test2();
