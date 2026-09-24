const error = new Error("PostgrestError");
error.code = "PGRST116";
error.details = "No rows returned";
error.hint = null;

console.log("JSON.stringify(error):", JSON.stringify(error));
console.log("JSON.stringify({ error, code: error.code, details: error.details, hint: error.hint }):", 
  JSON.stringify({ error, code: error.code, details: error.details, hint: error.hint }));
