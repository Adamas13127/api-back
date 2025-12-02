// DTO de mise à jour d'utilisateur.
// PartialType rend tous les champs de CreateUserDto optionnels pour le PATCH.
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
