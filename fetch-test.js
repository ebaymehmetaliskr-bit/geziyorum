async function test() {
  const res = await fetch('https://www.geziyorumturkiye.com/wp-json/');
  const data = await res.json();
  console.log("name:", data.name);
  console.log("description:", data.description);
  console.log("site_icon:", data.site_icon, "site_icon_url:", data.site_icon_url);
  console.log("site_logo:", data.site_logo, "site_logo_url:", data.site_logo_url);
}
test();
