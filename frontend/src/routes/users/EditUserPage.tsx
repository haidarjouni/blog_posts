import { Form, useLoaderData } from "react-router-dom";
import type { UserLoaderData } from "./userLoad";

export default function EditUserPage() {
     const { user } = useLoaderData() as UserLoaderData; ; 
     return (
          <>
           <div className="flex min-h-[90vh] flex-col justify-center px-6  lg:px-8">
               <div className="sm:mx-auto sm:w-full sm:max-w-sm">
               <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Edit your account</h2>
               </div>

               <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
               <Form  method="post" className="space-y-6">
                    <input type="hidden" name="intent" value="update-user" />
                    <div>
                         <label  className="block text-sm/6 font-medium text-gray-900">Username </label>
                         <div className="mt-2">
                              <input id="username" type="username" name="username" defaultValue={user.username} required  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                         </div>
                         </div>
                         <label  className="block text-sm/6 font-medium text-gray-900">Email </label>
                         <div className="mt-2">
                              <input id="email" type="email" defaultValue={user.email} name="email" required  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                         </div>
                         <div>
                    </div>

                    <div>
                    <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Update</button>
                    </div>
               </Form>
               </div>
          </div>
          </>
     );
}
