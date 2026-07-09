package com.logistics.optimizer.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum VehicleType {
    TRUCK("Truck"),
    VAN("Van"),
    BIKE("Bike"),
    DRONE("Drone"),
    SHIP("Ship"),
    RAIL("Rail");

    private final String displayName;
}
