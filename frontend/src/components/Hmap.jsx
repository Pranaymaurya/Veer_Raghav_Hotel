export default function Hmap(){
    return (
        <div className="mb-2">
            <h3 className="text-xl font-semibold mb-4 text-center">Our Location</h3>
            <div className=" bg-gray-200 rounded-lg m-3">
              {/* Map placeholder - replace with actual map component */}
              <div className="w-full h-full bg-gray-300 rounded-lg">
                <div style={{ width: '100%' }}>
                  <iframe
                    width="100%"
                    height="400"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Uttar%20Paras%20math%20Near%20kanak%20bhavan%20mandir%20ayodhya%20224123%20uttar%20pradesh+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                    title="Business Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
    )
}