const mockDB: Record<string, any> = {};

export async function getProductFromDB(id: string) {
  await new Promise((res) => setTimeout(res, 100)); // simulate latency
  return mockDB[id] || null;
}

export async function saveProductToDB(data: any) {
  const id = Date.now().toString();
  mockDB[id] = { id, ...data };
  return mockDB[id];
}

export async function updateProductInDB(id: string, data: any) {
  if (!mockDB[id]) throw new Error('Not found');
  mockDB[id] = { ...mockDB[id], ...data };
  return mockDB[id];
}

export async function deleteProductFromDB(id: string) {
  delete mockDB[id];
}
