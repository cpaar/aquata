import { IsIn, IsInt, IsOptional, IsUUID, Max, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

const shipTypes = [
  "piranha",
  "qualle",
  "hai",
  "hackboot",
  "taifun",
  "tsunami",
  "blizzard",
  "hurricane",
  "bermuda",
  "kittyHawk",
  "enterprise",
  "atlantis",
  "harvester",
] as const;
const researchTypes = ["shipbuilding", "frigateEngineering", "industrialLogistics"] as const;

export class StartBuildDto {
  @IsIn(shipTypes)
  buildableId!: (typeof shipTypes)[number];

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class StartResearchDto {
  @IsIn(researchTypes)
  researchId!: (typeof researchTypes)[number];
}

export class ShipLoadoutDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  piranha?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  qualle?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  hai?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  hackboot?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  taifun?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  tsunami?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  blizzard?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  hurricane?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  bermuda?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  kittyHawk?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  enterprise?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  atlantis?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  harvester?: number;
}

export class SendFleetDto {
  @IsUUID()
  targetStationId!: string;

  @ValidateNested()
  @Type(() => ShipLoadoutDto)
  ships!: ShipLoadoutDto;

  @IsOptional()
  @IsIn(["attack", "defend"])
  mission?: "attack" | "defend";

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6)
  stationTicks?: number;
}

export class StartScanDto {
  @IsUUID()
  targetStationId!: string;
}

export class RunTickDto {
  @IsOptional()
  @IsUUID()
  roundId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  tickNumber?: number;
}
