import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Image } from 'cloudinary-react'
const cloudName = process.env.CLOUDINARY_NAME


const Profile = (props) => {

  return (
    <>
      <Head>
        <title>Perfil | {props.user.name}</title>
      </Head>
      <div>
        {props.user.profilePicture ? <Image cloudName={cloudName} publicId={props.user.profilePicture} width="256" height="256" crop="scale" /> : null}
        <section>
          <div>
            <h2>{props.user.name}</h2>
            <Link href="/profile/settings">
              <button type="button">Edit</button>
            </Link>
          </div>
          Bio
          <p>{props.user.bio}</p>
          Email
          <p>
            {props.user.email}
          </p>
        </section>
      </div>
    </>
  )
}

export default Profile