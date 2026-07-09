package com.logistics.optimizer.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CargoType {
    GENERAL("General Cargo"),
    FRAGILE("Fragile Items"),
    PERISHABLE("Perishable Goods"),
    HAZARDOUS("Hazardous Materials"),
    OVERSIZED("Oversized Load"),
    LIQUID("Liquid Cargo");

    private final String displayName;
}
