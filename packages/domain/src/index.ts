export type ResourceStock = {
  aluminium: number;
  steel: number;
  energy: number;
};

export const emptyResources = (): ResourceStock => ({
  aluminium: 0,
  energy: 0,
  steel: 0,
});

export function addResources(current: ResourceStock, delta: ResourceStock): ResourceStock {
  return {
    aluminium: current.aluminium + delta.aluminium,
    energy: current.energy + delta.energy,
    steel: current.steel + delta.steel,
  };
}
