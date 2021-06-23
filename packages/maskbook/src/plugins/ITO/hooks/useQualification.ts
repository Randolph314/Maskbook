import { useAsyncRetry } from 'react-use'
import type { AbiItem } from 'web3-utils'
import type { Qualification } from '@masknet/contracts/types/Qualification'
import QualificationABI from '@masknet/contracts/abis/Qualification.json'
import { useAccount, useContract } from '@masknet/web3-shared'

export function useQualification(qualification_address: string) {
    const account = useAccount()
    const qualificationContract = useContract<Qualification>(qualification_address, QualificationABI as AbiItem[])

    return useAsyncRetry(async () => {
        const startTime = await qualificationContract!.methods.get_start_time().call({ from: account })
        return Number(startTime) * 1000
    }, [account, qualificationContract])
}
