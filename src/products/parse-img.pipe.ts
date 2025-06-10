import { ArgumentMetadata, FileTypeValidator, HttpStatus, Injectable, MaxFileSizeValidator, ParseFilePipe, ParseFilePipeBuilder, PipeTransform, UnprocessableEntityException } from "@nestjs/common";
import * as fs from 'fs/promises'

@Injectable()
export class ParseImagesPipe implements PipeTransform {
    constructor(private readonly maxSize: number) {}

    async transform(files: Express.Multer.File[], metadata: ArgumentMetadata) {
        if(!files) return files;

        
        const parseFilePipe = new ParseFilePipeBuilder()
        .addMaxSizeValidator({
            maxSize: this.maxSize
        })
        .addFileTypeValidator({
            fileType: /^image\/(png|jpg|jpeg|gif)/,
            skipMagicNumbersValidation: true
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })

        // for .. in 은 배열의 인덱스 열거, struct의 속성 열거입니다.
        // for .. of 을 사용하는 것이 맞습니다.
        for (const file of files) {
            try {
                await parseFilePipe.transform(file);
            } catch (err) {
                await Promise.all(
                    files.map(async (file) => {
                        try {
                            await fs.unlink(file.path)
                        } catch (e) {
                        }
                    })
                )
                throw new UnprocessableEntityException(err.message);
            }
        }
        return files;
    }
}