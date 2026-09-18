export function sendResponse(res, statusCode, contentType, payload) {

  res.statusCode = statusCode // 200 is success, 400 is bad request, 404 is not found, 500 is server failed
  res.setHeader('Content-Type', contentType);
  res.end(payload);
  
}

