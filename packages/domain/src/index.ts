export type ResourceStock = {
  lightMetal: number;
  heavyMetal: number;
  energy: number;
};

export const emptyResources = (): ResourceStock => ({
  energy: 0,
  heavyMetal: 0,
  lightMetal: 0,
});

export function addResources(current: ResourceStock, delta: ResourceStock): ResourceStock {
  return {
    energy: current.energy + delta.energy,
    heavyMetal: current.heavyMetal + delta.heavyMetal,
    lightMetal: current.lightMetal + delta.lightMetal,
  };
}
