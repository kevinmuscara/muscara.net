---
title: 'Detect AutoPilot Enrollment in OOBE for MAR Compliancy'
published: 2024-08-15
---

As a **Microsoft Authorized Refurbisher (MAR)**, ensuring that a used or refurbished Windows device is not enrolled in another organizations AutoPilot profile is cruicial, not just for usability, but for compliance with Microsoft's licensing terms. Accidentally reselling a managed device can violate these terms and leave the customer with an unusable system.

Ideally this wouldn't be a problem if every refurbished machine receives a freshly installed Digital Product Key (DPK). However, the refurb industry is corrupt, and often reuse OEM keys (that often come with the device on arrival to the refurb company) to save costs on purchasing new DPKs.

For one specific MAR company, this trick I utilized gave them a reliable way to verify if a machine has previously been enrolled in AutoPilot by inspecting a specific registry path. Using this, the company lowered costs on purchasing new DPKs while being able to reuse as many OEM keys coming from machines in stock. In return, it led to the highest profit margin per machine they had seen.

## Refresher: Windows AutoPilot?

Windows AutoPilot is Microsoft's cloud provisioning system that allows organizations to preconfigure devices before users receive them. A key component of AutoPilot is the profile, which is assigned to a device using its hardware hash and stored in Microsoft Intune (or another MDM).

When a device is reset and restarted, it will check with Microsoft's cloud services during the Out of Box Experience (OOBE) phase. If it is enrolled in AutoPilot, it automatically joins Azure AD and applies the organization's profile, locking down the device.

For obvious reasons, refurbishers must ensure that this enrollment is cleared before reselling the machine.

## Detecting AutoPilot Enrollment via the Registry

The PowerShell cmdlet `Get-ItemProperty` can read Windows registry values. The following registry path is present on systems that have been enrolled into AutoPilot.

```shell
HKLM:\SOFTWARE\Microsoft\Provisioning\Diagnostics\Autopilot
```

This registry key contains diagnostic data related to AutoPilot deployment. If this key and its values exist, than that's a clear indicator the device is part of an organizations AutoPilot program.

### Sample Script

```shell title="autopilot_check.ps1"
$autopilotRegPath = "HKLM:\SOFTWARE\Microsoft\Provisioning\Diagnostics\Autopilot"

if (Test-Path $autopilotRegPath) {
    $autopilotData = Get-ItemProperty -Path $autopilotRegPath
    # Machine is enrolled in AutoPilot 
    $autopilotData | Format-List
} else {
    # Machine is not enrolled
    Write-Host "No Autopilot enrollment data."
}
```

### Sample Output

```shell
CloudAssignedTenantId  : b13f4cda-1234-4567-abcd-e13f12b6fa90
CloudAssignedDeviceName: MACHINE-123456
CloudAssignedAadServerData : <base64 string>
```

If these values appear, primarily the `CloudAssignedTenantId` field, than the device is AutoPilot managed.

:::caution
Even if the device has been reset, AutoPilot enrollment remains active until it is removed from Microsoft’s AutoPilot service by the original tenant.
:::

## OOBE Behavior (Enrolled vs Unenrolled)

During Windows setup (OOBE), the system checks with Microsofts provisioning service to determine if it's part of an AutoPilot profile.

### Enrolled Devices:
1. OOBE is modified and skips user selection screens.
2. Azure AD join and MDM enrollment happen automatically.
3. The end user cannot bypass or remove this enrollment.

### Unenrolled Devices:

1. Standard OOBE experience (region, keyboard, user setup).
2. User can create local account or choose domain join options.
3. No MDM enrollment unless done manually.

If you resell a device that is still enrolled, the buyer might see a message like:

> “This device is managed by your organization. Contact your IT admin to proceed.”


## Your Options for AutoPilot Devices
:::important
You **cannot remove the AutoPilot profile yourself** unlesss you are part of the original Azure AD tenant that registered the device. 
:::

To ensure the device is compliant with MAR licensing agreement, you can do any of the following options:

1. **Contact the organization that managed the device** and ask them to unregister it from their AutoPilot portal.
2. **Install a new DPK** from Microsoft.
3. **Avoid reselling the device** if you cannot verify AutoPilot removal.

