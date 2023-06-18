function fetchGet(url) {
  return fetch(process.env.REACT_APP_API_URL + url, {
    method: "GET",
    mode: "cors",
    credentials: "include",
  });
}

function fetchPost(
  url = "",
  data = {},
  header = {
    "Content-Type": "application/json",
  },
  useRawBody = false,
) {
  // console.log(`${url}\n${JSON.stringify(data)}`);
  return fetch(process.env.REACT_APP_API_URL + url, {
    method: "POST",
    headers: header,
    body: useRawBody ? data : JSON.stringify(data),
    mode: "cors",
    credentials: "include",
  });
}

function fetchPut(
  url = "",
  data = {},
  header = {
    "Content-Type": "application/json",
  },
  useRawBody = false,
) {
  // console.log(`${url}\n${JSON.stringify(data)}`);
  return fetch(process.env.REACT_APP_API_URL + url, {
    method: "PUT",
    headers: header,
    body: useRawBody ? data : JSON.stringify(data),
    mode: "cors",
    credentials: "include",
  });
}

function fetchDelete(url) {
  return fetch(process.env.REACT_APP_API_URL + url, {
    method: "DELETE",
    mode: "cors",
    credentials: "include",
  });
}

function fetchTest() {
  return fetch(`${process.env.REACT_APP_API_URL}/test`);
}

export { fetchTest, fetchGet, fetchPost, fetchPut, fetchDelete };
