exports.review_v1 = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello From Review V1!",
    }),
  };
};

exports.review_v2 = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello From Review V2!",
    }),
  };
};

exports.review_v3 = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello From Review V3!",
    }),
  };
};