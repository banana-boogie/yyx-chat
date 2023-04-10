const { getOpenAIResponse } = require("../../src/services/openai");

test("getOpenAIResponse", async () => {
  const response = await getOpenAIResponse("Hello");
  expect(response);
});
