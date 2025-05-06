function filterElementColor(json: any) {
    if (!json) return json;
  
    const obj_queue = [json];
  
    while (obj_queue.length > 0) {
      const obj = obj_queue.pop();
  
      if (obj == null) continue;
  
      if (Array.isArray(obj)) {
        for (const item of obj) {
          if (typeof item === 'object' && item !== null) {
            obj_queue.push(item);
          }
        }
      } else if (typeof obj === 'object') {
        for (const key in obj) {
          const value = obj[key];
          if (key === "element" && value?.name === "Quantum") {
            obj[key]["color"] = "#2a1bf2";
          } else if (typeof value === 'object' && value !== null) {
            obj_queue.push(value);
          }
        }
      }
    }
  
    return json;
  }
  



export { filterElementColor };