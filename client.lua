local isLoadingScreenActive = true -- Define the variable before using it

-- When the player has fully spawned into the server
AddEventHandler('playerSpawned', function()
    if isLoadingScreenActive then
        -- Close the loading screen when player spawns
        ShutdownLoadingScreenNui()
        isLoadingScreenActive = false -- Update the state
        
        -- Optional: Print a debug message to confirm loading screen was closed
        if GetConvarInt('mns_debug', 0) == 1 then
            print("MNS Loading Screen: Closed after player spawn")
        end
    end
end)

-- Adding a fallback in case the event doesn't trigger
Citizen.CreateThread(function()
    -- Wait 15 seconds after script starts (should be plenty of time to spawn)
    Citizen.Wait(15000)
    
    -- If still active, force close
    if isLoadingScreenActive then
        ShutdownLoadingScreenNui()
        isLoadingScreenActive = false
        
        if GetConvarInt('mns_debug', 0) == 1 then
            print("MNS Loading Screen: Force closed after timeout")
        end
    end
end)

