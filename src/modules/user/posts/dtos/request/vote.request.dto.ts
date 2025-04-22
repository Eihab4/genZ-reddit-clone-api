import { IsIn, IsNotEmpty } from 'class-validator';

export class VotePostDto {
  @IsNotEmpty()
  @IsIn([1, -1], { message: 'Vote must be 1 (upvote) or -1 (downvote)' })
  vote: number;
}
