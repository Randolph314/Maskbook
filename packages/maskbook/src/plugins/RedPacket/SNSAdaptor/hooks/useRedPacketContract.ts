import type { AbiItem } from 'web3-utils'
import { RED_PACKET_CONSTANTS } from '../../constants'
import { useConstantNext, useContract } from '@masknet/web3-shared'
import HappyRedPacketV1ABI from '@masknet/contracts/abis/HappyRedPacketV1.json'
import type { HappyRedPacketV1 } from '@masknet/contracts/types/HappyRedPacketV1'
import HappyRedPacketV2ABI from '@masknet/contracts/abis/HappyRedPacketV2.json'
import type { HappyRedPacketV2 } from '@masknet/contracts/types/HappyRedPacketV2'
import HappyRedPacketV3ABI from '@masknet/contracts/abis/HappyRedPacketV3.json'
import type { HappyRedPacketV3 } from '@masknet/contracts/types/HappyRedPacketV3'

export function useRedPacketContract(version: number) {
    const {
        HAPPY_RED_PACKET_ADDRESS_V1: addressV1,
        HAPPY_RED_PACKET_ADDRESS_V2: addressV2,
        HAPPY_RED_PACKET_ADDRESS_V3: addressV3,
    } = useConstantNext(RED_PACKET_CONSTANTS)
    const v1 = useContract<HappyRedPacketV1>(addressV1, HappyRedPacketV1ABI as AbiItem[])
    const v2 = useContract<HappyRedPacketV2>(addressV2, HappyRedPacketV2ABI as AbiItem[])
    const v3 = useContract<HappyRedPacketV3>(addressV3, HappyRedPacketV3ABI as AbiItem[])
    const versions = [v1, v2, v3] as const
    return versions[version - 1]
}
