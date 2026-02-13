import { ExploitantDTO } from "../exploitants/ExploitantDTO";
export class UtilisateurDTO {
  userCode?: string;
  userName?: string;
  userTitle?: string;
  userEmail?: string;
  role?: string;
  userPasswordString?: string;
  idExploitant?: string;
  exploitant?: ExploitantDTO;
  telephone?: string;

  constructor(init?: Partial<UtilisateurDTO>) {
    Object.assign(this, init);
  }
  isValid(): boolean {
    return !!this.userCode && !!this.userPasswordString;
  }
}