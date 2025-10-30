<script>
	import { downloadBackup } from '$lib/helpers/BackUpFunctions/downloadBackup';
	import { uploadBackup } from '$lib/helpers/BackUpFunctions/uploadBackup';
</script>

<div class="flex flex-col gap-4">
	<div class="w-full flex border-b-2 justify-center pb-4">
		<button
			on:click={downloadBackup}
			class="cursor-pointer w-full justify-center md:w-1/2 flex gap-2 border-2 bg-white/40 rounded-xs p-3 py-2"
			>Sicherungskopie herunterladen
			<div class="min-w-6">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M18 20.289L21.288 17l-.688-.688l-2.1 2.1v-4.887h-1v4.887l-2.1-2.1l-.688.688zM14.5 23.5v-1h7v1zm-8.384-4q-.652 0-1.134-.482T4.5 17.884V4.116q0-.652.482-1.134T6.116 2.5H13L18.5 8v3.14h-1V8.5h-5v-5H6.116q-.231 0-.424.192t-.192.423v13.77q0 .23.192.423t.423.192h6v1zm-.616-1v-15z"
						stroke-width="0.7"
						stroke="currentColor"
					/></svg
				>
			</div>
		</button>
	</div>
	<div class="w-full items-center flex flex-col gap-4">
		<div
			class="w-full justify-center md:w-1/2 flex flex-col items-center border-2 bg-white/40 rounded-xs gap-2"
		>
			<label for="backupUpload" class="flex justify-center cursor-pointer w-full gap-2 p-3 py-2"
				>Sicherungskopie hochladen
				<div class="min-w-6 -scale-y-100">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="M18 20.289L21.288 17l-.688-.688l-2.1 2.1v-4.887h-1v4.887l-2.1-2.1l-.688.688zM14.5 23.5v-1h7v1zm-8.384-4q-.652 0-1.134-.482T4.5 17.884V4.116q0-.652.482-1.134T6.116 2.5H13L18.5 8v3.14h-1V8.5h-5v-5H6.116q-.231 0-.424.192t-.192.423v13.77q0 .23.192.423t.423.192h6v1zm-.616-1v-15z"
							stroke-width="0.7"
							stroke="currentColor"
						/></svg
					>
				</div>
			</label>
			<input
				type="file"
				id="backupUpload"
				accept=".json"
				class="sr-only"
				on:change={(e) => uploadBackup(e)}
			/>
		</div>
		<div class="text-xs text-white md:text-sm">
			<span class="font-bold">Achtung:</span> Beim Hochladen wird dein aktuelles Sammelheft überschrieben!
		</div>
	</div>
</div>
