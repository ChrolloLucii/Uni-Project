import {Menu} from "@headlessui/react"
import Image from "next/image"
import { Fragment } from "react"

export default function TournamentAction({tournament, onDelete, onManage}){
    return (
    <Menu as="div" className = "relative inline-block text-left">
        <Menu.Button className ="flex items-center justify-center rounded-lg p-2 hover:bg-gray-700">
            <Image src="/gear-option-preference-svgrepo-com.svg" alt="Edit" width={24} height={24} />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-600 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className = "px-1 py-1">
        <Menu.Item>
            {({active}) =>(
                <button
                    onClick ={() => onDelete(tournament.id)}
                    className={`${
                        active ? "bg-gray-700 text-white" : "text-gray-300"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                        Удалить турнир
                </button>
            )}

        </Menu.Item>
        <Menu.Item>
            {({active}) =>(
                <button
                    onClick ={() => onManage(tournament.id)}
                    className={`${
                        active ? "bg-gray-700 text-white" : "text-gray-300"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                        Управление
                </button>
            )}
            </Menu.Item>
        </div>


        </Menu.Items>
</Menu>
);
}