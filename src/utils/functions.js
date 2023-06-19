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
  return fetch(`${process.env.REACT_APP_API_URL}/check`);
}

const periodStartYear = 2018;
function getPeriodList() {
  const toReturn = [];
  const currentYear = new Date().getFullYear();

  for (let i = periodStartYear; i < currentYear + 1; i += 1) {
    toReturn.push(`${i}-1`);
    toReturn.push(`${i}-2`);
  }
  return toReturn;
}
function getCurrentPeriod() {
  const current = new Date();
  const currentYear = current.getFullYear();
  const currentMonth = current.getMonth();
  // 3월 1일 ~ 8월 31일 => 1학기 => 1
  const semester = currentMonth >= 2 && currentMonth < 8 ? 1 : 2;
  return `${currentYear}-${semester}`;
}

export { fetchTest, fetchGet, fetchPost, fetchPut, fetchDelete, getPeriodList, getCurrentPeriod };
