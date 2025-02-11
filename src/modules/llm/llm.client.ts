import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { Readable } from 'stream';

interface LLMRequest {
  llm_type: string;
  template: string;
  options: any;
  secret_key: string;
}

@Injectable()
export class LLMClient {
  private readonly logger = new Logger(LLMClient.name);
  private readonly llmType: string;
  private readonly secretKey: string;
  private readonly streamingRequestEndpoint: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.llmType = this.configService.get<string>('LLM_TYPE') || 'default-llm';
    this.secretKey =
      this.configService.get<string>('LLM_SERVER_SECRET_KEY') ||
      'default-secret';
    this.streamingRequestEndpoint =
      this.configService.get<string>('LLM_SERVER_ENDPOINT_STREAMING') ||
      '/streaming';
    this.baseUrl = 'https://hyobin-llm.duckdns.org';
  }

  receiveLLMStreaming(options: any, template: string): Observable<string> {
    const llmRequest: LLMRequest = {
      llm_type: this.llmType,
      template,
      options,
      secret_key: this.secretKey,
    };

    return this.webClientRequest(this.streamingRequestEndpoint, llmRequest);
  }

  private webClientRequest(
    requestEndpoint: string,
    llmRequest: LLMRequest,
  ): Observable<string> {
    const url = `${this.baseUrl}${requestEndpoint}`;
    console.log(llmRequest);
    return this.httpService
      .post(url, llmRequest, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        responseType: 'stream',
      })
      .pipe(
        switchMap((response: AxiosResponse<Readable>) => {
          const stream = response.data;
          let counter = 0;
          return new Observable<string>((observer) => {
            stream.on('data', (chunk: Buffer) => {
              counter++;
              const chunkStr = chunk.toString();
              if (counter % 10 === 0) {
                this.logger.log(`Received chunk: ${chunkStr}`);
              }
              observer.next(chunkStr);
            });
            stream.on('end', () => observer.complete());
            stream.on('error', (err) => observer.error(err));

            return () => stream.destroy();
          });
        }),
      );
  }
}
