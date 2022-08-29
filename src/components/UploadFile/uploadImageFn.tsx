export const uploadImageFn = (formData: FormData) =>
  fetch('/api/images/upload', {
    method: 'POST',
    body: formData,
  }).then((res) => res.json() as Promise<{ imageUrl: string }>);

export const uploadImageFnFromFile = (file: File) => {
  const data = new FormData();
  if (file) {
    data.append('file', file);
    return uploadImageFn(data);
  }
  return null;
};
