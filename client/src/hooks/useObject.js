export const useObject = () => {
  return useQuery({
    queryKey: ["form"],
    queryFn: () => getObjects(user.id),
  });
};
