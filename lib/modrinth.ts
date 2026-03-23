export async function searchMods(query, version, loader) {
  let url = `https://api.modrinth.com/v2/search?query=${query}&limit=20`;

  if (version || loader) {
    const facets = [];

    if (version) facets.push(`["versions:${version}"]`);
    if (loader) facets.push(`["categories:${loader}"]`);

    url += `&facets=[${facets.join(",")}]`;
  }

  const res = await fetch(url);
  return res.json();
}