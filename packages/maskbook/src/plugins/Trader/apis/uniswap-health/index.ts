import { TRENDING_CONSTANTS } from '../../constants'
import stringify from 'json-stable-stringify'
import { first } from 'lodash-es'
import { currentChainIdSettings } from '../../../Wallet/settings'
import { constantOfChain } from '@masknet/web3-shared'

async function fetchFromUniswapV2Health<T>(query: string) {
    const response = await fetch(
        constantOfChain(TRENDING_CONSTANTS, currentChainIdSettings.value).UNISWAP_V2_HEALTH_URL,
        {
            method: 'POST',
            mode: 'cors',
            body: stringify({
                query,
            }),
        },
    )

    const { data } = (await response.json()) as { data: T }
    return data
}

export async function fetchLatestBlocks() {
    type status = {
        synced: string
        health: string
        chains: {
            chainHeadBlock: {
                number: number
            }
            latestBlock: {
                number: number
            }
        }[]
    }
    const response = await fetchFromUniswapV2Health<{
        indexingStatusForCurrentVersion: status
    }>(`
      query health {
        indexingStatusForCurrentVersion(subgraphName: "uniswap/uniswap-v2") {
          synced
          health
          chains {
            chainHeadBlock {
              number
            }
            latestBlock {
              number
            }
          }
        }
      }
    `)

    const latestBlock = first(response.indexingStatusForCurrentVersion.chains)?.latestBlock.number
    const headBlock = first(response.indexingStatusForCurrentVersion.chains)?.chainHeadBlock.number

    return [latestBlock, headBlock]
}
