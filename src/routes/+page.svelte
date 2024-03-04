<script>
    import "../app.css";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let innerWidth = 0;
    let innerHeight = 0;
    let Globe;
    let myGlobe;

    let earthNight;

    let userLocation;

    onMount(async () => {
        const module = await import("globe.gl");
        Globe = module.default;
        initGlobe();
    });

    let showOverlay = false;
    let overlayContent = "";

    function toggleOverlay(contentType) {
        showOverlay = !showOverlay;

        showOverlay
            ? myGlobe.globeImageUrl("earth-night.jpg")
            : myGlobe.globeImageUrl("earth-blue-marble.jpg");

        overlayContent = contentType;
    }

    function initGlobe() {
        if (!Globe) return;

        myGlobe = Globe()(document.getElementById("globeViz"))
            .width(innerWidth - 10)
            .height(innerHeight - 10)
            .globeImageUrl("earth-blue-marble.jpg");

        // getAndSetGeoLocation();
    }

    function preloadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    function goToUserLocation() {
        if (userLocation) {
            myGlobe.pointOfView({ ...userLocation, altitude: 1.5 }, 1000); // 1000 milliseconds = 1 second
        }
    }

    function setLatestUserLocation() {
        if (!userLocation) return;

        const arcsData = [
            {
                startLat: 74,
                startLng: 40,
                endLat: userLocation.lat,
                endLng: userLocation.lng,
                color: ["red", "blue"],
            },
        ];

        const labelsData = [
            {
                lat: 74,
                lng: 40,
                name: `Visitor before`,
                color: "lightblue",
                altitude: 0.01,
            },
        ];

        myGlobe.pointOfView({ lat: 74, lng: 40, altitude: 1.5 }, 1000); // 1000 milliseconds = 1 second

        myGlobe.arcsData(arcsData).labelsData(labelsData);
    }

    function getAndSetGeoLocation() {
        fetch(
            `https://api.geoapify.com/v1/ipinfo?&apiKey=${import.meta.env.VITE_GEO_KEY}`,
        )
            .then((response) => response.json())
            .then((data) => {
                // Assuming data.city contains name, latitude, and longitude
                const city = data.city;

                userLocation = {
                    lat: data.location.latitude,
                    lng: data.location.longitude,
                };

                // Add a label for the city
                const labelsData = [
                    {
                        lat: data.location.latitude,
                        lng: data.location.longitude,
                        name: `You are in ${city.name} ${data.country.name}`,
                        color: "lightblue",
                        altitude: 0.01,
                    },
                ];

                myGlobe
                    .labelsData(labelsData)
                    .labelText("name")
                    .labelColor("color")
                    .labelAltitude("altitude")
                    .labelSize(1) // Adjust label size as needed
                    .labelDotRadius(0.2) // Adjust dot radius as needed
                    .labelResolution(2); // Adjust for sharper text

                goToUserLocation();
            })
            .catch((error) => {
                console.error("Failed to load the city data:", error);
            });
    }
</script>

<svelte:head>
    <title>Globe Example</title>
</svelte:head>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="customContainer relative w-full">
    <div id="globeViz" />

    <button
        on:click={() => toggleOverlay("experience")}
        class=" absolute top-0 left-0 m-2 inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white dark:focus:ring-green-800"
    >
        <span
            class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
        >
            Experience
        </span>
    </button>

    <button
        on:click={() => toggleOverlay("projects")}
        class=" absolute top-0 right-0 m-2 inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white dark:focus:ring-green-800"
    >
        <span
            class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
        >
            Projects
        </span>
    </button>

    <div class="absolute bottom-0 left-0 flex m-4 gap-3">
        <button
            type="button"
            class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
        >
            <svg
                width="24px"
                height="24px"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#fff"
                ><path
                    d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path><path
                    d="M7 17V13.5V10"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path><path
                    d="M11 17V13.75M11 10V13.75M11 13.75C11 10 17 10 17 13.75V17"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path><path
                    d="M7 7.01L7.01 6.99889"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path></svg
            >
        </button>
        <button
            type="button"
            class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
        >
            <svg
                width="24px"
                height="24px"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#fff"
                ><path
                    d="M16 22.0268V19.1568C16.0375 18.68 15.9731 18.2006 15.811 17.7506C15.6489 17.3006 15.3929 16.8902 15.06 16.5468C18.2 16.1968 21.5 15.0068 21.5 9.54679C21.4997 8.15062 20.9627 6.80799 20 5.79679C20.4558 4.5753 20.4236 3.22514 19.91 2.02679C19.91 2.02679 18.73 1.67679 16 3.50679C13.708 2.88561 11.292 2.88561 8.99999 3.50679C6.26999 1.67679 5.08999 2.02679 5.08999 2.02679C4.57636 3.22514 4.54413 4.5753 4.99999 5.79679C4.03011 6.81549 3.49251 8.17026 3.49999 9.57679C3.49999 14.9968 6.79998 16.1868 9.93998 16.5768C9.61098 16.9168 9.35725 17.3222 9.19529 17.7667C9.03334 18.2112 8.96679 18.6849 8.99999 19.1568V22.0268"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path><path
                    d="M9 20.0267C6 20.9999 3.5 20.0267 2 17.0267"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path></svg
            >
        </button>
    </div>

    <div class="absolute bottom-0 right-0 flex m-4 gap-3">
        <button
            on:click={setLatestUserLocation}
            type="button"
            class="text-white border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
        >
            <svg
                width="24px"
                height="24px"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#fff"
                ><path
                    d="M5 20V19C5 15.134 8.13401 12 12 12V12C15.866 12 19 15.134 19 19V20"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path><path
                    d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path></svg
            >

            Visitor Before
        </button>

        <button
            on:click={goToUserLocation}
            type="button"
            class="text-white border border-blue-700 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
        >
            <svg
                width="24px"
                height="24px"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#fff"
                ><path
                    d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path><path
                    d="M12 19V21"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path><path
                    d="M5 12H3"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path><path
                    d="M12 5V3"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path><path
                    d="M19 12H21"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path></svg
            >

            Current Location
        </button>
    </div>
</div>

{#if showOverlay}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <!-- svelte-ignore a11y-interactive-supports-focus -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
        on:click={toggleOverlay}
        role="button"
        transition:fade={{ delay: 250, duration: 300 }}
    >
        <div class="p-8 lg:w-1/2 lg:p-20">
            <div class="lg:sticker top-48 py-8 lg:sticky lg:py-20">
                <div
                    id="card"
                    class="duet--recirculation--list-breaker-compact ml:m-auto relative ml-[65px] min-h-[475px] w-mobile-breaker rounded-[4px] p-4 sm:w-tablet-breaker md:mb-40 lg:sticky lg:top-40 lg:mt-0 lg:ml-0 lg:min-h-[600px] lg:w-desktop-breaker lg:overflow-hidden lg:rounded-[20px] text-white"
                >
                    <!-- For Mobile -->
                    <!-- <h2
                        class="absolute top-[-25px] left-[-80px] -z-10 flex rotate-180 font-manuka text-[110px] font-ultra leading-100 tracking-1 text-gray-900 dark:text-white lg:hidden"
                        style="writing-mode: vertical-rl; text-orientation: sideways;"
                    >
                        My Experience
                    </h2> -->

                    <div
                        class="absolute right-0 bottom-[-10px] hidden h-full rotate-180 font-manuka text-[120px] leading-100 lg:flex text-red-800"
                        style="writing-mode: vertical-rl; text-orientation: sideways;"
                    >
                        My Experience
                    </div>

                    <div class="relative">
                        <div>
                            <h2 class="text-red-800">Floris Wieringa</h2>
                        </div>
                        <p
                            class="mb-8 text-11 uppercase leading-140 tracking-15"
                        >
                            <span class="block text-gray-400"
                                >Feed refreshed at 17 Apr 2023</span
                            >
                        </p>
                    </div>

                    <ol
                        class="styled-counter w-full lg:w-[320px] styled-counter-compact svelte-yp3aj5"
                    >
                        <li
                            class="py-3 text-franklin last:mb-0 last:border-0 last:pb-0 lg:last:mb-20 border-b-franklin svelte-yp3aj5"
                        >
                            <a
                                class="text-white hover:text-franklin mb-4 font-polysans text-18 font-medium leading-110 tracking-1 svelte-yp3aj5"
                                href="#section-1">Full Stack SINCERIUS</a
                            >
                            <p
                                class="duet--recirculation--breaker-byline font-polysans text-11 uppercase leading-140 tracking-15"
                            >
                                <span class="mr-8 font-light">Sept 2023</span>
                                <span class="mr-8 font-light">Current</span>
                            </p>
                        </li>
                        <li
                            class="border-y py-3 text-franklin last:mb-0 last:border-0 last:pb-0 lg:last:mb-20"
                        >
                            <a
                                class="text-white hover:text-franklin mb-4 font-polysans text-18 font-medium leading-110 tracking-1 svelte-yp3aj5"
                                href="#section-2"
                                >Computer BSc Hogeschool Leiden</a
                            >
                            <p
                                class="duet--recirculation--breaker-byline font-polysans text-11 uppercase leading-140 tracking-15 svelte-yp3aj5"
                            >
                                <span class="mr-8 font-light">2018</span>
                                <span class="mr-8 font-light">2022</span>
                            </p>
                        </li>
                        <li
                            class="border-y py-3 text-franklin last:mb-0 last:border-0 last:pb-0 lg:last:mb-20 border-b-franklin"
                        >
                            <a
                                class="text-white hover:text-franklin mb-4 font-polysans text-18 font-medium leading-110 tracking-1 svelte-yp3aj5"
                                href="#section-3"
                                >Android Developer Pinch / Internship</a
                            >
                            <p
                                class="duet--recirculation--breaker-byline font-polysans text-11 uppercase leading-140 tracking-15 svelte-yp3aj5"
                            >
                                <span class="mr-8 font-light">Mar 2021</span>
                                <span class="mr-8 font-light">Feb 2022</span>
                            </p>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .customContainer {
        display: flex;
        align-content: center;
        align-items: center;

        justify-content: center;
        width: 100vw;
        height: 100vh;
    }

    :global(body) {
        margin: 0;
    }
</style>
