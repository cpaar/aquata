import { IsIn, IsInt, IsOptional, IsUUID, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

const shipTypes = ["fighter", "interceptor", "frigate", "harvester"] as const;
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
  fighter?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  interceptor?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  frigate?: number;

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
