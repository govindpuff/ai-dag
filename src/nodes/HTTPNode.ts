import axios from "axios"
import _ from "lodash"
import { DAGNode, HTTPNodeParams, ProviderFactory } from "../types"

export class HTTPNode implements DAGNode {
  id: string
  type: string
  params: HTTPNodeParams
  children: string[]

  constructor(id: string, params: HTTPNodeParams, children: string[]) {
    this.id = id
    this.type = "HTTP"
    this.params = params
    this.children = children
  }

  async execute(
    _input: string,
    _providerFactory: ProviderFactory
  ): Promise<string> {
    const { url, method, body, outputPath } = this.params

    try {
      const response =
        method === "GET"
          ? await axios.get(url, { headers: this.params.headers })
          : await axios.post(url, body, { headers: this.params.headers })

      return _.get(response.data, outputPath, JSON.stringify(response.data))
    } catch (error) {
      console.error("Error in HTTP request:", error)
      throw error
    }
  }
}
