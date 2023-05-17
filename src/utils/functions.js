function fetchGet(url) {
  return fetch(process.env.REACT_APP_API_URL + url, {
    method: "GET",
    mode: "cors",
    credentials: "include",
  });
}

function fetchPost(
  url,
  data,
  header = {
    "Content-Type": "application/json",
  },
  useRawBody = false,
) {
  // console.log(`${url}\n${JSON.stringify(data)}`);
  return fetch(process.env.REACT_APP_API_URL + url, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: header,
    body: useRawBody ? data : JSON.stringify(data),
  });
}

export { fetchGet, fetchPost };
