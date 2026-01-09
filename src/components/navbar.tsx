import { Grok } from "@lobehub/icons";
import { LogoutButton } from "./auth/logout";
import { DeleteMessages } from "./delete-messages";
import { Menu } from "./menu";

export function Navbar() {
  return (
    <header className="p-4 w-full flex justify-between items-center">
      <div className="flex justify-start items-center gap-x-2">
        <Grok size={30} />
      </div>
      <div className="flex gap-x-2 items-center">
        <Menu />
        <DeleteMessages />
        <LogoutButton />
      </div>
    </header>
  );
}
