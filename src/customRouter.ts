import { useRouter } from 'next/router';

const ROUTES = {
  MAIN: '/',
  SCAN: '/scan',
  UPDATE_TREES: '/update_trees',
  PLANT: (plantId: string) => `/check/${plantId}`,
  ADD_IMAGE: (plantId: string) => `/add_image/${plantId}`,
};

export const useCustomRouter = () => {
  const router = useRouter();

  return {
    query: router.query,
    goToMain: () => router.push(ROUTES.MAIN),
    goToPlantState: (plantId: string) => router.push(ROUTES.PLANT(plantId)),
    goToUpdateTrees: () => router.push(ROUTES.UPDATE_TREES),
    goToScan: () => router.push(ROUTES.SCAN),
    addImage: (plantId: string) => router.push(ROUTES.ADD_IMAGE(plantId)),
  };
};
