local isLoadingScreenActive = true

-- When the player has fully spawned into the server
AddEventHandler('playerSpawned', function()
    -- Don't immediately close the loading screen - wait for character selection
    -- We'll handle this with the QBCore callback below
end)

-- Create a thread to check when the player is fully loaded with their character
Citizen.CreateThread(function()
    -- Wait a moment for everything to initialize
    Citizen.Wait(1000)

    -- Check if QBCore exists and use its callback for character loaded
    if GetResourceState('qb-core') == 'started' then
        -- Wait for QBCore to be loaded
        while not exports['qb-core'] do
            Citizen.Wait(100)
        end
        
        -- Listen for when the player has selected a character and is fully loaded
        RegisterNetEvent('QBCore:Client:OnPlayerLoaded')
        AddEventHandler('QBCore:Client:OnPlayerLoaded', function()
            if isLoadingScreenActive then
                -- Wait an extra second for everything to render properly
                Citizen.Wait(1000) 
                ShutdownLoadingScreenNui()
                isLoadingScreenActive = false
            end
        end)
    else
        -- If QBCore is not found, fall back to a timer-based approach
        Citizen.Wait(15000) -- Wait 15 seconds for character selection to finish
        
        if isLoadingScreenActive then
            ShutdownLoadingScreenNui()
            isLoadingScreenActive = false
        end
    end
end)

-- Safety fallback in case the above methods fail
Citizen.CreateThread(function()
    -- Maximum time to keep loading screen active (30 seconds)
    Citizen.Wait(30000)
    
    if isLoadingScreenActive then
        ShutdownLoadingScreenNui()
        isLoadingScreenActive = false
    end
end)

